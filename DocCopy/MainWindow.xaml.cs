using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using Microsoft.VisualBasic.MyServices;

namespace DocCopy
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private DirectoryInfo docsDir;
        private DirectoryInfo reactCrosswordDir;
        private FileSystemProxy fs;

        public MainWindow()
        {
            InitializeComponent();
            fs = new Microsoft.VisualBasic.Devices.Computer().FileSystem;
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            GetDirectories();
            CopyDist();
            CopyIndexHtml();
            CopyAssets();
            Application.Current.Shutdown();
        }
        private void GetDirectories()
        {
            var dir = new DirectoryInfo(System.IO.Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location));
            while (dir.Name != "react-sun-crossword")
            {
                dir = dir.Parent;
            }
            var dirs = dir.GetDirectories();
            docsDir = dirs.First(d => d.Name == "docs");
            reactCrosswordDir = dirs.First(d => d.Name == "react-sun-crossword");
        }
        private void CopyDist()
        {
            CopyDir("dist");
        }
        private void CopyIndexHtml()
        {
            File.Copy(System.IO.Path.Combine(reactCrosswordDir.FullName, "index.html"), System.IO.Path.Combine(docsDir.FullName, txtIndexHtml.Text + ".html"),true);
        }
        private void CopyAssets()
        {
            CopyDir("assets");
        }
        private void CopyDir(string dirName)
        {
            fs.CopyDirectory(System.IO.Path.Combine(reactCrosswordDir.FullName, dirName), System.IO.Path.Combine(docsDir.FullName, dirName), true);
        }
    }
}
